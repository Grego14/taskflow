const SOUND_PATHS = {
  archive: '/sounds/archive_task.wav',
  delete: '/sounds/delete_task.wav',
  notification: '/sounds/new_notification.wav',

  complete: '/sounds/complete_task.wav',
  click: '/sounds/complete_task.wav',
  cancel: '/sounds/complete_task.wav',

  // "zen mode" sounds
  startSession: '/sounds/work_on_task.wav',
  endSession: '/sounds/success.wav',
  endSessionGoal: '/sounds/alarm.wav'
}

const audioCache = {}

/**
 * Play a lazy loaded system sound
 * @param {string} name
 * @param {boolean} loop - If true, the sound will repeat until stopSound is called
 */
export function playSound(name, loop = false) {
  let soundPath = SOUND_PATHS[name]
  // check if we already have an instance, otherwise create it

  if (!audioCache[name] && soundPath) {
    const audio = new Audio(soundPath)
    audio.volume = 0.4
    audioCache[name] = audio
  }

  const sound = audioCache[name]

  if (sound) {
    // reset to be able to play the sound again
    sound.currentTime = 0
    sound.loop = loop
    
    sound.play().catch(() => {
      console.warn(`Audio playback blocked or failed for: ${name}`)
    })
  }
}

/**
 * Stop a specific sound or all instantiated sounds
 * @param {string|null} name 
 */
export function stopSound(name = null) {
  if (name) {
    const sound = audioCache[name]
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  } else {
    // only iterate over sounds that were actually loaded in memory
    for (const key in audioCache) {
      audioCache[key].pause()
      audioCache[key].currentTime = 0
    }
  }
}

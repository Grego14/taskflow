const sounds = {
  archive: new Audio('/sounds/archive_task.wav'),
  delete: new Audio('/sounds/delete_task.wav'),
  notification: new Audio('/sounds/new_notification.wav'),
  complete: new Audio('/sounds/complete_task.wav'),

  // "work on task" sounds
  startSession: new Audio('/sounds/work_on_task.wav'),
  endSession: new Audio('/sounds/success.wav'),
  endSessionGoal: new Audio('/sounds/alarm.wav')
}

for (const key in sounds) {
  sounds[key].volume = 0.4
  sounds[key].load()
}

/**
 * Play a system sound
 * @param {string} name 
 * @param {boolean} loop - If true, the sound will repeat until stopSound is called
 */
export function playSound(name, loop = false) {
  const sound = sounds[name]

  if (sound) {
    // reset to be able to play the sound again (like on fast tasks deletions)
    sound.currentTime = 0
    sound.loop = loop
    sound.play().catch(() => {
      console.error("Couldn't play the sound [[%s]]", name)
    })
  }
}

/**
 * Stop a specific sound or all sounds
 * @param {string|null} name - The name of the sound to stop, or null to stop all
 */
export function stopSound(name = null) {
  if (name) {
    const sound = sounds[name]
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  } else {
    for (const key in sounds) {
      sounds[key].pause()
      sounds[key].currentTime = 0
    }
  }
}

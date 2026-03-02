const sounds = {
  archive: new Audio('/sounds/archive_task.wav'),
  delete: new Audio('/sounds/delete_task.wav'),
  notification: new Audio('/sounds/new_notification.wav'),
  complete: new Audio('/sounds/complete_task.wav')
}

for (const key in sounds) {
  sounds[key].volume = 0.4
  sounds[key].load()
}

/**
 * Play a system sound
 * @param {('archive'|'delete'|'notification'|'complete')} name 
 */
export default function playSound(name) {
  const sound = sounds[name]

  if (sound) {
    // reset to be able to play the sound again (like on fast tasks deletions)
    sound.currentTime = 0
    sound.play().catch(() => { })
  }
}

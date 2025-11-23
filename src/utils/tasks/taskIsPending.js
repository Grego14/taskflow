// this function will be used in the next app version to also manage the doing
// status of a task which is not going to be as easy as checking the status
// (will use task start time and other things)
export default function taskIsPending(status) {
  return status !== 'done' && status !== 'cancelled'
}

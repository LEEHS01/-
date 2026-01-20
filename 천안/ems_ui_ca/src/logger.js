// errorTracker.js

const errors = []

const log = {
  logError: (message) => errors.push(message),
  getErrors: () => [...errors] // 필요 시 내부에서만 접근 가능
}

export default log

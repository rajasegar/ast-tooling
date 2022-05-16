async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();

  try {
    while (true) {
      const {
        done: done,
        value: value
      } = await reader.read();

      if (done) {
        return;
      }

      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
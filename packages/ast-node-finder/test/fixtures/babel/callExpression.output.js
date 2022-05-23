root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
root.find(j.CallExpression, {
  callee: {
    object: { name: 'foo' },
    property: { name: 'bar' }
  }
})
root.find(j.CallExpression, {
  callee: {
    object: { callee: {
    object: { type: "ThisExpression" },
    property: { name: 'get' }
  } },
    property: { name: 'pushPayload' }
  }
})
.filter(path => {
  return path.value.arguments[0].name === 'payload'
})
root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
.filter(path => {
  return path.value.arguments[0].name === 'a'
})
root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
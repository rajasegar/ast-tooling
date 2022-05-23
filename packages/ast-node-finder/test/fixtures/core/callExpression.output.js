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
  return path.value.arguments[0].raw === '1'
&& path.value.arguments[1].raw === '2'
&& path.value.arguments[2].name === 'a'
&& path.value.arguments[3].raw === 'world'
})
root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
.filter(path => {
  return path.value.arguments[0].raw === '1'
})
root.find(j.CallExpression, {
  callee: { name: 'hello' }
})
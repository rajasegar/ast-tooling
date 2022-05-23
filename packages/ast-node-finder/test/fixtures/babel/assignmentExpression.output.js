root.find(j.AssignmentExpression, {
  operator: '=',
  left: { name: 'hello' },
  right: { value: 'world' }
})
root.find(j.AssignmentExpression, {
  operator: '=',
  left: { name: 'world' },
  right: { value: 1 }
})
root.find(j.AssignmentExpression, {
  operator: '=',
  left: { name: 'flag' },
  right: { value: true }
})
root.find(j.AssignmentExpression, {
  operator: '=',
  left: { name: 'hello' },
  right: { name: 'world' }
})
root.find(j.AssignmentExpression, {
    operator: '=',
    left: { name: 'foo' },
    right: {
  object: { name: 'bar' },
  property: { name: 'baz' }
}
  })
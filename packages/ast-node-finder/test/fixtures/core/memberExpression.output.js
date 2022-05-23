root.find(j.MemberExpression, {
    object: { name: 'foo' },
    property: { name: 'bar' }
    })
root.find(j.MemberExpression, {
    object: { object: { name: 'foo' } ,
  property: { name: 'bar' }
},
    property: { name: 'baz' }
    })
root.find(j.MemberExpression, {
    object: { type: "ThisExpression" },
    property: { name: 'hello' }
    })
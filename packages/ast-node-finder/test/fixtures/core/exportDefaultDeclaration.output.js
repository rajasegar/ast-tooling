root.find(j.ExportDefaultDeclaration, {
  declaration: { callee: {
      object: { name: 'Router' },
      property: { name: 'extend' }
    } }
  })
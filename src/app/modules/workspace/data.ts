// request
const request = {
  id: 'ID Usuario de mongo',
  workspaces: [
    {
      id: 'ID Workspace do Power BI',
      reports: ['ID Reports do Power BI']
    }
  ]
}

// response

const response = {
  user: {
    name: '',
    email: '',
    phone: ''
  },
  workspace: [
    {
      id: '',
      name: '',
      contaAsociada: {
        name: '',
        email: ''
      },
      reports: [
        {
          id: '',
          name: '',
          embedURL: ''
        }
      ]
    }
  ]
}

const permissed = [
  {
    id: 'ID Workspace',
    name: 'NAME Workspace',
    contaAsociada: {
      name: '',
      email: ''
    },
    reports: [
      {
        name: 'NAME REPORT',
        id: 'ID Reports',
        groupdID: '',
        embedURL: '',
        // ...
      }
    ]
  }
]

// Account -> Workspace -> Reports

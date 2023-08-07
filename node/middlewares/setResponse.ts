const setResponse = async (context: Context): Promise<void> => {
  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')

  context.status = 200
  context.body = context.state.body
}

export default setResponse

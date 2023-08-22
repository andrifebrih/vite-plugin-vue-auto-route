const virtual = require('@rollup/plugin-virtual')
const { parsePagesDirectory } = require('./directory-parser')

const virtualModuleId = 'vue-auto-route'
const resolvedVirtualModuleId = '\0' + virtualModuleId

function makeModuleContent({ pagesDir,excludeDirs }) {
  const { routes } = parsePagesDirectory(pagesDir,excludeDirs)
  return `export const routes = [${routes.join(', \n')}]`
}
 
module.exports = function ({ pagesDir,excludeDirs } = { pagesDir: 'src/pages/', excludeDirs:[] }) {
 
  
 

  /* Note: these route options are not yet used anywhere */
  const vueCustomBlockTransforms = {
    route: ({ code }) => {
      return `
        export default function (Component) {
          Component.__routeOptions = ${code}
        }
      `
    },
  } 

  return { 
    resolveId(id) { 
      if (id == virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return makeModuleContent({ pagesDir,excludeDirs })
      }
    },
    
    plugins: [virtual({ 'vue-auto-routes': makeModuleContent({ pagesDir,excludeDirs }) })],
    vueCustomBlockTransforms }
}

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const rootDir = path.join(__dirname, '..')

console.log('🚀 Iniciando configuración del nuevo proyecto...')

rl.question('Nombre del proyecto (kebab-case, ej: mi-app-ventas): ', (appName) => {
  rl.question('Nombre legible (ej: Mi App de Ventas): ', (prettyName) => {
    rl.question('ID de la App (ej: com.empresa.ventas): ', (appId) => {
      updatePackageJson(appName, appId)
      updateHtmlTitle(prettyName)

      console.log(`\n✅ ¡Listo! Proyecto renombrado a: ${prettyName}`)
      console.log('👉 Ahora ejecuta: npm install')
      rl.close()
    })
  })
})

function updatePackageJson(name, appId) {
  const packagePath = path.join(rootDir, 'package.json')
  if (fs.existsSync(packagePath)) {
    let content = fs.readFileSync(packagePath, 'utf8')
    const json = JSON.parse(content)

    // Actualizar campos
    json.name = name
    json.description = `Project ${name} generated from template`

    // Actualizar configuración de Electron Builder si existe
    if (json.build) {
      json.build.appId = appId
      json.build.productName = name
    }

    fs.writeFileSync(packagePath, JSON.stringify(json, null, 2))
    console.log('📄 package.json actualizado.')
  }
}

function updateHtmlTitle(title) {
  const htmlPath = path.join(rootDir, 'src', 'renderer', 'index.html')
  if (fs.existsSync(htmlPath)) {
    let content = fs.readFileSync(htmlPath, 'utf8')
    content = content.replace(/<title>.*<\/title>/, `<title>${title}</title>`)
    fs.writeFileSync(htmlPath, content)
    console.log('📄 index.html actualizado.')
  }
}

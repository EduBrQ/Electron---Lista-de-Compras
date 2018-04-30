const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENVIROMENT
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Verificar se o aplicativo está pronto
app.on('ready', function(){
    //cria nova janela
    mainWindow = new BrowserWindow({});
    // Carrega html dentro da janela
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    // Sair da subjanelas quando fechar a janela principal
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Criar menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Inserir menu
    Menu.setApplicationMenu(mainMenu);
});


// Criar addWindow
function createAddWindow(){
    // cria nova janela
    addWindow = new BrowserWindow({
        width:400,
        height:300,
        title:'Adicionar Item'
    });
    // carrega html na janela
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //
    addWindow.on('close', function(){
        addWindow = null;
    });

}

// pega item.add
ipcMain.on('item:add', function(e, item){
    //console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// cria menu template
const mainMenuTemplate = [
    {
        label:'Arquivo',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Limpar Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Sair',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];
// if mac, add objeto vazio no menu (corrige nome electron ao inves de file no menu)
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({}); // unshift -> adiciona {} no inicio do menu
}
// Add no menu principal -> Ferramentas do Desenvolvedor
if(process.env.NODE_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }

        ]
    })

}
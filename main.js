const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

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
        width:300,
        height:200,
        title:'Add Item a Lista de Compras'
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

// menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
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
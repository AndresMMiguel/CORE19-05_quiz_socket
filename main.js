const readline = require('readline');

const {log, biglog, errorlog, colorize} = require("./out");

const cmds = require("./cmds");
const net = require("net");

net.createServer(socket => {
    console.log("Se ha conectado un cliente desde " + socket.remoteAddress);
// Mensaje inicial
biglog(socket, 'CORE Quiz', 'green');

const rl = readline.createInterface({
    input: socket,
    output: socket,
    prompt: colorize("quiz > ", 'blue'),
    completer: (line) => {
        const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
        const hits = completions.filter((c) => c.startsWith(line));
        // show all completions if none found
        return [hits.length ? hits : completions, line];
    }
});

socket.on("end",()=>{rl.close();}).on("error", ()=>{rl.close();});
rl.prompt();

rl
.on('line', (line) => {

    let args = line.split(" ");
    let cmd = args[0].toLowerCase().trim();

    switch (cmd) {
        case '':
            rl.prompt();
            break;

        case 'help':
        case 'h':
            cmds.helpCmd(rl);
            break;

        case 'quit':
        case 'q':
            cmds.quitCmd(socket, rl);
            break;

        case 'add':
            cmds.addCmd(rl);
            break;

        case 'list':
            cmds.listCmd(rl);
            break;

        case 'show':
            cmds.showCmd(rl, args[1]);
            break;

        case 'test':
            cmds.testCmd(rl, args[1]);
            break;

        case 'play':
        case 'p':
            cmds.playCmd(rl);
            break;

        case 'delete':
            cmds.deleteCmd(rl, args[1]);
            break;

        case 'edit':
            cmds.editCmd(rl, args[1]);
            break;

        case 'credits':
            cmds.creditsCmd(rl);
            break;

        default:
            log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
            log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
            rl.prompt();
            break;
    }
})
.on('close', () => {
    console.log("Se ha desconectado el cliente desde " + socket.remoteAddress);
    log(socket, 'Adios!');
});
}).listen(3030);
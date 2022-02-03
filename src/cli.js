import inquirer from 'inquirer'


export default {
    async Question(message){
        const response = await inquirer.prompt({
            name: 'response',
            type: 'input',
            message: message
        })
    
        return response.response
    },
    
    async askWtihOptions(message, args){
        const Optionask = await inquirer.prompt({
            name: 'optionAsk',
            type: 'list',
            message: `${message}\n`,
            choices: args
        })
    
        return Optionask.optionAsk
    }
}
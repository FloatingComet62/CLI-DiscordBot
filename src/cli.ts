import inquirer from 'inquirer'


export default {
    async Question(message: string) {
        const response = await inquirer.prompt({
            name: 'response',
            type: 'input',
            message: message
        })

        return response.response
    },

    async askWtihOptions(message: string, args: string[]) {
        const Optionask = await inquirer.prompt({
            name: 'optionAsk',
            type: 'list',
            message: `${message}\n`,
            choices: args
        })

        return Optionask.optionAsk
    }
}
import enquirer from "enquirer"

const { Select, Form } = enquirer;

export const createPrompt = (type, options) => {
    let prompts = {
        select: Select,
        form: Form
    }
    return new prompts[type]({
        name: type,
        ...options
    });
}

export const askToSelect = async (message, choices) => {
    let select = createPrompt("select", { message, choices });
    return await select.run();
}

export const askForForm = async (message, choices) => {
    let form = createPrompt("form", { message, choices });
    return await form.run();
}

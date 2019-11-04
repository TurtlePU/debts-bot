import { Locale } from './locale';

const ru: Locale = {
    anon: () => `Прости, я не знаю, кто ты.`,
    hi: name =>
`Привет, ${name}!
* Напиши /debts, чтобы посмотреть список долгов и расходов.
* Напиши мне в беседе с другим человеком количество денег, и я оформлю новый долг.`,
    debts: debts => {
        return '';
    }
};

export default ru;

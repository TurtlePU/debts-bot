import { Locale } from './locale';

const ru: Locale = {
    anon: () => `Прости, я не знаю, кто ты.`,
    hi: name =>
`Привет, ${name}!
_i_. Напиши /debts, чтобы посмотреть список долгов и расходов.
_ii_. Напиши мне в беседе с другим человеком количество денег, и я оформлю новый долг.`,
    debts: debts => {
        if (debts.length == 0) {
            return `Долгов нет!`;
        } else {
            return debts
                .map(({ to_name, amount }) => `${to_name}: ${amount}`)
                .reduce((prev, curr) => `${prev}\n${curr}`, `С кем вы связаны:\n`);
        }
    }
};

export default ru;

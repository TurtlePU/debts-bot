import { Locale } from './locale'
import { shieldMarkdown } from '@util'

const ru: Locale = {
    currency: '₽',
    anon: 'Прости, я не знаю, кто ты.',
    hi: name =>
        `Привет, ${name}!\n` +
        '_i_. Напиши /debts, чтобы посмотреть список долгов и расходов.\n' +
        '_ii_. Напиши мне в беседе с другим человеком количество денег, и я оформлю новый долг.',
    debts: debts => {
        if (debts.length == 0) {
            return 'Долгов нет!'
        } else {
            return debts
                .map(({ to_name, amount, currency }) => `${to_name}: ${amount}${currency}`)
                .reduce((prev, curr) => `${prev}\n${curr}`, 'С кем вы связаны:\n')
        }
    },
    offerArticle: (amount: number, currency: string) => {
        const abs = Math.abs(amount)
        const shielded = shieldMarkdown(currency)
        const title = amount > 0 ? `Взять ${abs}${currency}` : `Дать ${abs}${currency}`
        const text = amount > 0 ? `Я взял ${abs}${shielded}.` : `Я дал ${abs}${shielded}.`
        const button_text = 'Ок'
        return { title, text, button_text }
    },
    offer: {
        expired: 'Простите, но время действия предложения истекло.',
        selfAccept: 'Нельзя принять своё же предложение!',
        saved(from_name, to_name, amnt, currency) {
            const [ from, to, amount ] =
                amnt > 0 ?
                    [ from_name, to_name, amnt ] :
                    [ to_name, from_name, -amnt ]
            return `${from} получил ${amount}${currency} от ${to}.`
        }
    }
}

export default ru

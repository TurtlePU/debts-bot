import {
    shieldMarkdown
} from '#/util/StringUtils'

const ru: Locale = {
    currency: '₽',
    anon: 'Прости, я не знаю, кто ты.',
    buttons: {
        accept: 'Ок 👍',
        reject: 'Не 👎'
    },
    hi: name =>
        `Привет, ${shieldMarkdown(name)}!\n` +
        '_i_. Напиши /debts, чтобы посмотреть список долгов и расходов.\n' +
        '_ii_. Напиши мне в беседе с другим человеком количество денег, и я оформлю новый долг.\n' +
        '\n' +
        '*Важно!* inline-режим только для парных долгов, в группах используйте команды.',
    debts: debts => {
        const deb = reduce(debts.filter(({ amount }) => amount > 0), 'Вы должны:')
        const owe = reduce(debts.filter(({ amount }) => amount < 0), 'Вам должны:')
        if (!deb || !owe) {
            return deb ?? owe ?? 'Долгов нет!'
        } else {
            return deb + '\n\n' + owe
        }
    },
    offerArticle: (amount: number, currency: string) => {
        const abs = Math.abs(amount)
        const shielded = shieldMarkdown(currency)
        const title = amount > 0 ? `Взять ${abs} ${currency}` : `Дать ${abs} ${currency}`
        const text = amount > 0 ? `Я взял ${abs} ${shielded}.` : `Я дал ${abs} ${shielded}.`
        return { title, text }
    },
    offer: {
        expired: 'Простите, но время действия предложения истекло.',
        declined(by) {
            return `Предложение отклонено ${shieldMarkdown(by)}`
        },
        selfAccept: 'Нельзя принять своё же предложение!',
        saved(from_name, to_name, amnt, currency) {
            const [ from, to, amount ] =
                amnt > 0 ?
                    [ from_name, to_name, amnt ] :
                    [ to_name, from_name, -amnt ]
            const [ shFrom, shCur, shTo ] = [ from, currency, to ].map(shieldMarkdown)
            return `${shFrom} получил ${amount}${shCur} от ${shTo}.`
        }
    },
    settleUpArticle: {
        title: 'Обнулить долги',
        text: 'Обнулим долги?'
    },
    settleUp: (first, second) =>
        `Долги между ${shieldMarkdown(first)} и ${shieldMarkdown(second)} обнулены.`
}

export default ru

function reduce(debts: Locale.Debt[], title: string): string | undefined {
    if (debts.length == 0) {
        return undefined
    } else {
        return debts
            .map(({ to, amount, currency }) => `${to}: ${Math.abs(amount)} ${currency}`)
            .reduce((acc, cur) => acc + '\n' + cur, title + '\n')
    }
}

import {
    shieldMarkdown
} from '#/util/StringUtils'

const ru: Locale = {
    currency: '₽',
    messageTexts: {
        anon: 'Прости, я не знаю, кто ты.',
        hi: name =>
            `Привет, ${shieldMarkdown(name)}!\n` +
            '*i*. Напиши /balance, чтобы посмотреть список долгов и расходов.\n' +
            '*ii*. Напиши мне в беседе с другим человеком количество денег,'
            + ' и я оформлю новый долг.\n' +
            '*iii*. Добавь меня в группу для работы с группой!\n' +
            '\n' +
            '*Важно!* inline-режим только для парных долгов, в группах используйте команды.',
        debts(debts) {
            const plus = debts.filter(({ amount }) => amount > 0)
            const mins = debts.filter(({ amount }) => amount < 0)
            if (plus.length || mins.length) {
                return '' +
                    (plus.length
                        ? 'Вы должны:\n' + plus.map(x => toString(x, true)).reduce(concat) : '') +
                    (plus.length && mins.length ? '\n\n' : '') +
                    (mins.length
                        ? 'Вам должны:\n' + mins.map(x => toString(x, true)).reduce(concat) : '')
            } else {
                return 'Долгов нет!'
            }
        },
        toUpdate:
            'Подождите, сообщение скоро обновится...',
        wrongChatForDebt:
            'Здесь нельзя создавать долги!\n' +
            'Напиши мне либо в inline-режиме для парного долга, либо в группе для группового.',
        group: {
            hi: 'Всем привет!\n' +
                '\n' +
                '*i*. Напишите /members, чтобы посмотреть список участников.\n' +
                '*ii*. Напишите сумму и валюту / причину, чтобы начать оформление долга.\n' +
                '*iii*. Напишите /balance, чтобы посмотреть балансы участников.',
            notGroup:
                'Мы не в группе, я не могу выполнить такой запрос.',
            members: names =>
                names.length
                    ? 'Участники:\n' + names.reduce(concat)
                    : 'Участников почему-то нет :(',
            balances(balances) {
                const sorted = [ ...balances ].sort(debtCompare)
                return sorted
                    .map((balance, i) =>
                        (sorted[i - 1]?.currency != balance.currency ? '\n' : '')
                        + toString(balance, false))
                    .reduce(concat)
            },
            offer: (amount, currency, payers, members) =>
                `Сумма долга: ${amount} ${currency}.\n` +
                (payers.length ? '\nКто заплатил:\n' + payers.reduce(concat) : '') +
                (payers.length && members.length ? '\n' : '') +
                (members.length ? '\nЗа кого платили:\n' + members.reduce(concat) : ''),
            offerSaved: (updates, amount, currency) =>
                `Сумма долга: ${amount} ${currency}.\n\n` +
                updates
                    .sort(({ delta: a }, { delta: b }) => a - b)
                    .map(({ username, delta }) => `${username}: ${delta}`)
                    .reduce(concat)
        },
        offerSaved(from_name, to_name, amnt, currency) {
            const [ from, to, amount ] = amnt > 0
                ? [ from_name, to_name, amnt ]
                : [ to_name, from_name, -amnt ]
            const [ shFrom, shCur, shTo ] = [ from, currency, to ].map(shieldMarkdown)
            return `${shFrom} получил ${amount} ${shCur} от ${shTo}.`
        },
        settledUp: (first, second) =>
            `Долги между ${shieldMarkdown(first)} и ${shieldMarkdown(second)} обнулены.`
    },
    hybrid: {
        offer: {
            expired: 'Пожалуйста, повторите запрос.',
            declined: by => `Отклонено ${shieldMarkdown(by)}.`
        }
    },
    buttons: {
        accept: 'Ок 👍',
        reject: 'Не 👎',
        join: 'Let me in!',
        updateMembers: 'Обновить',
        joinPayers: 'Я платил',
        leavePayers: 'Я не платил',
        joinMembers: 'За меня платили',
        leaveMembers: 'За меня не платили',
        lockOffer: 'Завершить',
        cancelOffer: 'Отменить'
    },
    articles: {
        offer: (amount: number, currency: string) => {
            const abs = Math.abs(amount)
            const shielded = shieldMarkdown(currency)
            const title = amount > 0 ? `Взять ${abs} ${currency}` : `Дать ${abs} ${currency}`
            const text = amount > 0 ? `Я взял ${abs} ${shielded}.` : `Я дал ${abs} ${shielded}.`
            return { title, text }
        },
        settleUp: {
            title: 'Обнулить долги',
            text: 'Обнулим долги?'
        }
    },
    response: {
        membersUpdated: 'Список участников обновлен.',
        joinSuccess: 'О\'кей, ты включен',
        selfAccept: 'Нельзя принять своё же предложение!',
        offerCanceled: 'Предложение отменено'
    }
}

export default ru

function toString({ to, amount, currency }: Locale.Debt, abs: boolean): string {
    const amnt = abs ? Math.abs(amount) : amount
    return to + ': ' + amnt + ' ' + currency
}

function concat(a: string, b: string) {
    return a + '\n' + b
}

function debtCompare(
        { currency: a0, amount: a1, to: a2 }: Locale.Debt,
        { currency: b0, amount: b1, to: b2 }: Locale.Debt
) {
    /* eslint-disable @typescript-eslint/indent */
    return (
        a0 != b0 ? a0.localeCompare(b0) :
        a1 != b1 ? a1 - b1 :
        a2 != b2 ? a2.localeCompare(b2) : 0
    )
    /* eslint-enable @typescript-eslint/indent */
}

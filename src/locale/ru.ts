import { shieldMarkdown } from '#/util/StringUtils'

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
                return (
                    (plus.length ? 'Вам должны:\n' + plus.map(toStringAbs).reduce(concat) : '') +
                    (plus.length && mins.length ? '\n\n' : '') +
                    (mins.length ? 'Вы должны:\n' + mins.map(toStringAbs).reduce(concat) : '')
                )
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
                    ? '*Участники*:\n\n' + names.map(noMention).reduce(concat)
                    : 'Участников почему-то нет :(',
            balances(balances) {
                const sorted = [ ...balances ].sort(debtCompare)
                return sorted
                    .map(({ to, ...tail }) => ({ to: noMention(to), ...tail }))
                    .map((balance, i) =>
                        (sorted[i - 1]?.currency != balance.currency ? '\n' : '')
                        + toString(balance))
                    .reduce(concat, '*Балансы*:')
            },
            offer: (amount, currency, from, to) =>
                `*Сумма долга*: ${amount} ${shieldMarkdown(currency)}.\n` +
                (from.length ? '\n*Кто заплатил*:\n' + from.map(noMention).reduce(concat) : '') +
                (from.length && to.length ? '\n' : '') +
                (to.length ? '\n*За кого платили*:\n' + to.map(noMention).reduce(concat) : ''),
            offerSaved: (updates, amount, currency) =>
                `*Сумма долга*: ${amount} ${shieldMarkdown(currency)}.\n\n` +
                updates
                    .sort(({ delta: a }, { delta: b }) => a - b)
                    .map(({ username, delta }) => `${noMention(username)}: ${delta}`)
                    .reduce(concat)
        },
        offerSaved(from_name, to_name, amnt, currency) {
            const [ from, to, amount ] = amnt > 0
                ? [ from_name, to_name, amnt ]
                : [ to_name, from_name, -amnt ]
            const [ shFrom, shCur, shTo ] = [ from, currency, to ].map(shieldMarkdown)
            return `${shFrom} дал ${amount} ${shCur} ${shTo}.`
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
            const title = amount > 0 ? `Дать ${abs} ${currency}` : `Взять ${abs} ${currency}`
            const text = amount > 0 ? `Я дал ${abs} ${shielded}.` : `Я взял ${abs} ${shielded}.`
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

function noMention(username: string): string {
    return shieldMarkdown(username[0] == '@' ? username.substr(1) : username)
}

function toString({ to, amount, currency }: Locale.Debt): string {
    return to + ': ' + amount + ' ' + currency
}

function toStringAbs({ to, amount, currency }: Locale.Debt): string {
    return toString({ to, amount: Math.abs(amount), currency })
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

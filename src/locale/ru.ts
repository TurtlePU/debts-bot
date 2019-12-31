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
        debts: debts => {
            const deb = reduce(debts.filter(({ amount }) => amount > 0), 'Вы должны:')
            const owe = reduce(debts.filter(({ amount }) => amount < 0), 'Вам должны:')
            if (!deb || !owe) {
                return deb ?? owe ?? 'Долгов нет!'
            } else {
                return deb + '\n\n' + owe
            }
        },
        toUpdate: 'Подождите, сообщение скоро обновится...',
        wrongChatForDebt:
            'Здесь нельзя создавать долги!\n' +
            'Напиши мне либо в inline-режиме для парного долга, либо в группе для группового.',
        group: {
            hi: 'Всем привет!\n' +
                '\n' +
                '*i*. Напишите /members, чтобы посмотреть список участников.',
            notGroup: 'Мы не в группе, я не могу выполнить такой запрос.',
            members(names) {
                if (names.length == 0) {
                    return 'Участников почему-то нет :('
                } else {
                    return names.reduce((prev, name) => `${prev}\n${name}`, 'Участники:\n')
                }
            },
            offer(amount, currency, payers, members) {
                return `Сумма долга: ${amount} ${currency}.\n` + (
                    payers.length
                        ? payers.reduce((str, curr) => `${str}\n${curr}`, '\nКто заплатил:')
                        : ''
                ) + (
                    payers.length && members.length ? '\n' : ''
                ) + (
                    members.length
                        ? members.reduce((str, curr) => `${str}\n${curr}`, '\nКто теперь должен:')
                        : ''
                )
            }
        },
        offerSaved(from_name, to_name, amnt, currency) {
            const [ from, to, amount ] =
                amnt > 0 ?
                    [ from_name, to_name, amnt ] :
                    [ to_name, from_name, -amnt ]
            const [ shFrom, shCur, shTo ] = [ from, currency, to ].map(shieldMarkdown)
            return `${shFrom} получил ${amount} ${shCur} от ${shTo}.`
        },
        settledUp: (first, second) =>
            `Долги между ${shieldMarkdown(first)} и ${shieldMarkdown(second)} обнулены.`
    },
    hybrid: {
        offer: {
            expired: 'Пожалуйста, повторите запрос.',
            declined(by) {
                return `Отклонено ${shieldMarkdown(by)}.`
            }
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
        lockOffer: 'Завершить'
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
        selfAccept: 'Нельзя принять своё же предложение!'
    }
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

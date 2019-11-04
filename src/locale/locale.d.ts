import { OutDebt } from '@db';

declare type Locale = {
    anon: () => string
    hi: (name: string) => string
    debts: (debts: OutDebt[]) => string
}

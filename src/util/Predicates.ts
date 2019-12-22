export function isDebtOffer(
        offer: DataBase.Offer.Doc): offer is DataBase.Offer.Doc & DataBase.DebtOffer {
    return offer.type == 'debt'
}

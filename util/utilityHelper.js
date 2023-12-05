
export function recordsOnPage(all, page, itemsOnPage){
    const from = (page - 1) * itemsOnPage;
    const to = from + itemsOnPage;
    return {
        from: Math.min(from, all),
        to: Math.min(to, all)
    }
}
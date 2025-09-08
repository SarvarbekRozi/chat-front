export function getDateRange(period) {
    const today = new Date()
    let from, to

    switch (period) {
        case 'today':
            from = to = today
            break

        case 'yesterday':
            const yest = new Date(today)
            yest.setDate(yest.getDate() - 1)
            from = to = yest
            break

        case 'this_week':
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay() + 1) // Dushanba
            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 6)
            from = weekStart
            to = weekEnd
            break

        case 'this_month':
            from = new Date(today.getFullYear(), today.getMonth(), 1)
            to = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            break

        case 'last_month':
            from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
            to = new Date(today.getFullYear(), today.getMonth(), 0)
            break

        case 'this_quarter':
            const quarter = Math.floor(today.getMonth() / 3)
            from = new Date(today.getFullYear(), quarter * 3, 1)
            to = new Date(today.getFullYear(), quarter * 3 + 3, 0)
            break

        case 'this_year':
            from = new Date(today.getFullYear(), 0, 1)
            to = new Date(today.getFullYear(), 11, 31)
            break

        default:
            from = ''
            to = ''
    }

    return {
        from_date: from ? formatDate(from) : '',
        to_date: to ? formatDate(to) : ''
    }
}

function formatDate(date) {
    const offset = date.getTimezoneOffset() // daqiqalarda
    const localDate = new Date(date.getTime() - offset * 60000)
    return localDate.toISOString().split('T')[0]
}

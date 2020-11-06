function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'title 1',
            url: 'www.1.com',
            description: 'desc 1',
            rating: 1,
        },
        {
            id: 2,
            title: 'title 2',
            url: 'www.2.net',
            description: 'desc 2',
            rating: 22,
        },
        {
            id: 3,
            title: 'title 3',
            url: 'www.3.org',
            description: 'desc 3',
            rating: 333,
        },
        {
            id: 4,
            title: 'title 4',
            url: 'www.4.edu',
            description: 'desc 4',
            rating: 4444,
        },
    ];
}

module.exports = {
    makeBookmarksArray,
}
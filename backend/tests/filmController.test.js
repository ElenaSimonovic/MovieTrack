const filmController = require('../controllers/film.controller');
const dbConn = require('../db/connection');

jest.mock('../db/connection', () => ({
    query: jest.fn()
}));

describe('unit testovi za Film Controller ', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // GET ALL
    test('getAll treba moci vratiti sve filmove', () => {

        const mockRezultat = [
            { Naziv_filma: 'Titanic' },
            { Naziv_filma: 'Avatar' }
        ];

        dbConn.query.mockImplementation((sql, callback) => {
            callback(null, mockRezultat);
        });

        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        filmController.getAll(req, res);
        expect(res.send).toHaveBeenCalledWith(mockRezultat);
    });


    // GET ONE
    test('getOne mora vratiti jedan film', () => {

        const mockFilm = [
            { Naziv_filma: 'Titanic' }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockFilm);
        });

        const req = {
            params: {
                naziv: 'Titanic'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        filmController.getOne(req, res);
        expect(res.send).toHaveBeenCalledWith(mockFilm[0]);
    });


    // CREATE
    test('create treba dodati film', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const req = {
            body: {
                naziv: 'Matrix',
                godina: 1999,
                opis: 'Svijet je lažan',
                zanr: 'SF',
                jezik: 'Engleski'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        filmController.create(req, res);

        expect(res.send).toHaveBeenCalledWith('Film dodan');
    });


    // UPDATE
    test('update treba ažurirati film', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const req = {
            params: {
                naziv: 'Titanic'
            },
            body: {
                godina: 2000,
                opis: 'bla bla',
                zanr: 'Drama',
                jezik: 'Engleski'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        filmController.update(req, res);

        expect(res.send).toHaveBeenCalledWith('Film ažuriran');
    });


    // DELETE
    test('treba obrisati film', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const req = {
            params: {
                naziv: 'Titanic'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        filmController.remove(req, res);

        expect(res.send).toHaveBeenCalledWith('Film obrisan');
    });

    // FILTER
    test('filter treba vratiti filmove po zanru', () => {

        const mockResult = [
            { Naziv_filma: 'Matrix', Zanr_filma: 'SF' }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockResult);
        });

        const req = {
            query: {
                zanr: 'SF'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        filmController.filter(req, res);

        expect(res.send).toHaveBeenCalledWith(mockResult);
    });


    // SEARCH

    test('search treba pronaći film po nazivu', () => {

        const mockResult = [
            { Naziv_filma: 'Avatar' }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockResult);
        });

        const req = {
            query: {
                query: 'Ava'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        filmController.search(req, res);

        expect(res.send).toHaveBeenCalledWith(mockResult);
    });

});
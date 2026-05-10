const listController = require('../controllers/lista.controller');
const dbConn = require('../db/connection');


jest.mock('../db/connection', () => ({
    query: jest.fn()
}));

describe('Unit Testovi Liste Controllera ', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // CREATE LIST
    test('createList treba stvoriti novu listu', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const emitMock = jest.fn();
        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                naziv: 'Moja lista',
                opis: 'bla bla',
                status: 'Privatna'
            },
            app: {
                get: jest.fn(() => ({
                    emit: emitMock
                }))
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        listController.createList(req, res);
        expect(res.send).toHaveBeenCalledWith('Lista kreirana');
        expect(emitMock).toHaveBeenCalledWith('db-update', { action: 'created' });
    });


    // DELETE LIST
    test('deleteList treba obrisati listu', () => {

        dbConn.query
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            })
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            });

        const emitMock = jest.fn();
        const req = {
            body: {
                id_osobne_liste: 1
            },
            app: {
                get: jest.fn(() => ({
                    emit: emitMock
                }))
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.deleteList(req, res);
        expect(res.send).toHaveBeenCalledWith('Lista obrisana');
        expect(emitMock).toHaveBeenCalledWith('db-update', { action: 'deleted' });
    });


    // ADD FILM TO LIST
    test('addFilmToList treba dodati film u listu', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const emitMock = jest.fn();
        const req = {
            body: {
                id_osobne_liste: 1,
                nazivFilma: 'Svadba'
            },
            app: {
                get: jest.fn(() => ({
                    emit: emitMock
                }))
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.addFilmToList(req, res);
        expect(res.send).toHaveBeenCalledWith('Film dodan u listu');
        expect(emitMock).toHaveBeenCalledWith('db-update', { action: 'movie-added' });
    });


    // REMOVE FILM FROM LIST
    test('removeFilmFromList treba ukloniti film iz liste', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const emitMock = jest.fn();
        const req = {
            body: {
                id_osobne_liste: 1,
                nazivFilma: 'Svadba'
            },
            app: {
                get: jest.fn(() => ({
                    emit: emitMock
                }))
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.removeFilmFromList(req, res);
        expect(res.send).toHaveBeenCalledWith('Film uklonjen iz liste');
        expect(emitMock).toHaveBeenCalledWith('db-update', { action: 'movie-removed' });
    });


    // GET FILMS FROM LIST
    test('getFilmsFromList treba vratiti filmove iz liste', () => {

        const mockResult = [
            { Naziv_filma: 'Svadba' },
            { Naziv_filma: 'Hail Mary' }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockResult);
        });
        const req = {
            params: {
                id: 1
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.getFilmsFromList(req, res);
        expect(res.send).toHaveBeenCalledWith(mockResult);
    });


    // GET ALL PUBLIC LISTS
    test('getAllPublicLists treba vratiti javne liste', () => {

        const mockResult = [
            {
                Naziv_liste: 'Top filmovi',
                Korisnicko_ime: 'admin'
            }
        ];

        dbConn.query.mockImplementation((sql, callback) => {
            callback(null, mockResult);
        });
        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.getAllPublicLists(req, res);
        expect(res.send).toHaveBeenCalledWith(mockResult);
    });

    // GET LISTS BY USER
    test('getListsByUser treba vratiti liste korisnika', () => {

        const mockResult = [
            {
                Naziv_liste: 'Favoriti'
            }
        ];
        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockResult);
        });
        const req = {
            params: {
                email: 'aavgustin@veleri.hr'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.getListsByUser(req, res);
        expect(res.send).toHaveBeenCalledWith(mockResult);
    });


    // SQL ERROR TEST
    test('createList treba vratiti 500 kod SQL greške', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback('SQL ERROR');
        });
        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                naziv: 'Lista'
            },
            app: {
                get: jest.fn()
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        listController.createList(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});
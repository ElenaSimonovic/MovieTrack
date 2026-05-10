const commentController = require('../controllers/komentar.controller');
const dbConn = require('../db/connection');


jest.mock('../db/connection', () => ({
    query: jest.fn()
}));


describe('Unit Testovi za komentarController', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // GET BY FILM
    test('getByFilm treba dati komentare za film', () => {

        const mockResult = [
            {
                Sadrzaj_komentara: 'Super film 5/5',
                Naziv_filma: 'Svadba'
            }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockResult);
        });

        const req = {
            params: {
                film: 'Svadba'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.getByFilm(req, res);
        expect(res.send).toHaveBeenCalledWith(mockResult);
    });


    // CREATE COMMENT
    test('create treba dodati komentar', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                film: 'Svadba',
                sadrzaj: 'Super film 5/5',
                ocjena: 5
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.create(req, res);
        expect(res.send).toHaveBeenCalledWith('Komentar dodan');
    });


    // REMOVE COMMENT
    test('remove treba izbrisati komentar', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
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
        commentController.remove(req, res);
        expect(res.send).toHaveBeenCalledWith('Komentar obrisan');
    });

    // REMOVE COMMENT NOT FOUND
    test('treba se vratiti error 404 ako taj komentar ne postoji', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const req = {
            params: {
                id: 1111
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Komentar nije pronađen');
    });


    // GET ALL COMMENTS
    test('getAll treba vratiti sve komentare', () => {

        const mockResult = [
            { Sadrzaj_komentara: 'Top film' },
            { Sadrzaj_komentara: 'Dosadan film' }
        ];

        dbConn.query.mockImplementation((sql, callback) => {
            callback(null, mockResult);
        });
        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.getAll(req, res);
        expect(res.send).toHaveBeenCalledWith(mockResult);
    });


    // UPDATE COMMENT
    test('update treba urediti komentar', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const req = {
            params: {
                id: 1
            },
            body: {
                sadrzaj: 'test komentar 123',
                ocjena: 4
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.update(req, res);
        expect(res.send).toHaveBeenCalledWith('Komentar uspješno uređen');
    });


    // UPDATE COMMENT NOT FOUND
    test('update treba vratiti 404 ako komentar koji se uređuje ne postoji', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 0 });
        });

        const req = {
            params: {
                id: 1111
            },
            body: {
                sadrzaj: 'Novi komentar',
                ocjena: 4
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Komentar nije pronađen');
    });


    // SQL ERROR TEST
    test('getAll treba vratiti 500 kod SQL greške', () => {

        dbConn.query.mockImplementation((sql, callback) => {
            callback('SQL ERROR');
        });

        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        commentController.getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});
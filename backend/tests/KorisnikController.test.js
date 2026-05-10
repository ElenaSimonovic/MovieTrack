const authController = require('../controllers/korisnik.controller');
const dbConn = require('../db/connection');


jest.mock('../db/connection', () => ({
    query: jest.fn()
}));


describe('korisnik controller Unit Testovi', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // REGISTRACIJA
    test('registracija treba uspješno stvoriti račun korisnika', () => {

        // prvi mockImplementation za Insert korisnika, drugi za insert liste favorita, treci za insert Watch later liste
        dbConn.query
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            })
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            })
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            });

        const req = {
            body: {
                email: 'Pero@gmail.com',
                korisnickoIme: 'Perica123',
                lozinka: '1234',
                datumRodjenja: '2001-11-11'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.registracija(req, res);
        expect(res.send).toHaveBeenCalledWith('Registracija OK');
    });


    // PRIJAVA USPJEŠNA
    test('prijava treba uspješno prijaviti korisnika u postoječi račun', () => {

        const mockUser = [
            {
                Email_korisnika: 'aavgustin@veleri.hr',
                Lozinka: '1234',
                Korisnicko_ime: 'aavgustin',
                Admin_da_ne: 0,
                Status_racuna: 'Aktivan'
            }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockUser);
        });

        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                lozinka: '1234'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.prijava(req, res);
        expect(res.send).toHaveBeenCalledWith({
            message: 'Prijava uspješna',
            email: 'aavgustin@veleri.hr',
            korisnickoIme: 'aavgustin',
            admin: false,
            status: 'Aktivan'
        });
    });


    // PRIJAVA - KORISNIK NE POSTOJI
    test('prijava treba vratiti erro 404 ako korisnik ne postoji', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const req = {
            body: {
                email: 'nepostoji@hotmail.com',
                lozinka: '1234'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.prijava(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Korisnik ne postoji.');
    });


    // PRIJAVA - KRIVA LOZINKA
    test('prijava treba vratiti 401 za krivu lozinku', () => {

        const mockUser = [
            {
                Lozinka: '1234'
            }
        ];

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, mockUser);
        });

        const req = {
            body: {
                email: 'test@test.com',
                lozinka: 'kriva'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.prijava(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Pogrešna lozinka.');
    });


    // OBRIŠI KORISNIKA
    test('obrisi korisnika treba obrisati korisnika', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
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
        authController.obrisiKorisnika(req, res);
        expect(res.send).toHaveBeenCalledWith('Obrisan');
    });


    // BLOKIRAJ KORISNIKA
    test('blokiraj treba blokirati korisnika', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null);
        });

        const req = {
            params: {
                email: 'test@test.com'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.blokiraj(req, res);
        expect(res.send).toHaveBeenCalledWith('Korisnik blokiran');
    });


    // CHANGE PASSWORD USPJEŠNO
    test('changePassword treba promijeniti lozinku', () => {

        dbConn.query
            .mockImplementationOnce((sql, values, callback) => {
                callback(null, [{ Lozinka: '1234' }]);
            })
            .mockImplementationOnce((sql, values, callback) => {
                callback(null);
            });

        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                oldPassword: '1234',
                newPassword: 'nova123'
            }
        };
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        authController.changePassword(req, res);
        expect(res.send).toHaveBeenCalledWith('Lozinka promijenjena');
    });


    // CHANGE PASSWORD - KRIVA STARA
    test('changePassword treba vratiti error 401 za krivu staru lozinku', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ Lozinka: '1234' }]);
        });

        const req = {
            body: {
                email: 'aavgustin@veleri.hr',
                oldPassword: 'kriva',
                newPassword: 'nova123'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        authController.changePassword(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Stara lozinka je kriva');
    });


    // CHANGE PASSWORD - USER NOT FOUND
    test('changePassword treba vratiti 404 ako korisnik ne postoji', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const req = {
            body: {
                email: 'netko@hotmail.com',
                oldPassword: '1234',
                newPassword: 'nova123'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        authController.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Korisnik ne postoji');
    });


    // SQL ERROR
    test('prijava treba vratiti 500 kod SQL greške', () => {

        dbConn.query.mockImplementation((sql, values, callback) => {
            callback('SQL ERROR');
        });

        const req = {
            body: {
                email: 'test@test.com',
                lozinka: '1234'
            }
        };

        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        authController.prijava(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});
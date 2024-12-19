const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('Authentication Routes', function () {
    this.timeout(10000);

    after(async () => {
        if (server) {
            setTimeout(() => {
                console.log('Tests completed. Server shutting down...');
                server.close();
            }, 2000); 
        }
    });

    describe('/POST signup', () => {
        it('should register a new user successfully', (done) => {
            chai.request(app)
                .post('/signup')
                .send({ username: 'TestUser', email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').eql('User registered successfully');
                    done();
                });
        });

        it('should not register a user with missing fields', (done) => {
            chai.request(app)
                .post('/signup')
                .send({ email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').eql('All fields are required');
                    done();
                });
        });

        it('should not register a user if the email already exists', (done) => {
            chai.request(app)
                .post('/signup')
                .send({ username: 'TestUser', email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error').eql('User already exists');
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('should login successfully with correct credentials', (done) => {
            chai.request(app)
                .post('/login')
                .send({ email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('message').eql('Login successful');
                    done();
                });
        });

        it('should not login with incorrect credentials', (done) => {
            chai.request(app)
                .post('/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error').eql('Invalid credentials');
                    done();
                });
        });

        it('should not login if the email does not exist', (done) => {
            chai.request(app)
                .post('/login')
                .send({ email: 'nonexistent@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error').eql('User does not exist');
                    done();
                });
        });
    });
});

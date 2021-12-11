import { Component, Fragment } from 'react';
import Navbar from '../components/Navbar'
import {
    Button,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Col,
    Row,
    FormGroup,
    FormFeedback
} from 'reactstrap';
import GalleryList from './components/GalleryList';

import { signInWithEmailAndPassword, signOut } from "firebase/auth";

class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            user: null,
            activeTab: "1",
            invalidLogin: false,
        }

        this.auth = this.props.auth
        this.storage = this.props.storage
        this.db = this.props.db
    }

    componentDidMount() {
        this.signOut()
        this.auth.onAuthStateChanged(this.updateUserState)
    }

    updateUserState = (user) => {
        this.setState({ user: user })
    }

    signIn = () => {
        let email = this.state.email
        let password = this.state.password

        signInWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                this.setState({ invalidLogin: true })
            });
    }

    signOut = async () => {
        signOut(this.auth).then(() => {
        }).catch((error) => {
            console.log(error)
        });
    }

    emailChanged = (e) => {
        let email = e.target.value
        this.setState({ email: email, invalidLogin: false })
    }

    passwordChanged = (e) => {
        let password = e.target.value
        this.setState({ password: password, invalidLogin: false })
    }

    switchTab = (id) => {
        this.setState({ activeTab: id })
    }

    validField = (field) => {
        return field !== null && field !== ""
    }

    validData = () => {
        return this.validField(this.state.email) && this.validField(this.state.password)
    }

    render() {
        if (this.state.user == null) {
            let valid = this.validData()
            let invalidLogin = this.state.invalidLogin

            return (
                <Col>
                    <Navbar />
                    <h1 className="mx-4">Admin</h1>

                    <Row className="justify-content-center align-content-center">
                        <Col className="mx-4" xs={6}>
                            <FormGroup>
                                <Input
                                    className="m-2"
                                    type="text"
                                    placeholder="Email"
                                    invalid={invalidLogin}
                                    onChange={this.emailChanged}/>

                                <Input
                                className="m-2"
                                    type="password"
                                    placeholder="Password"
                                    invalid={invalidLogin}
                                    onChange={this.passwordChanged}/>

                                <FormFeedback>
                                    Invalid username or password
                                </FormFeedback>
                            </FormGroup>

                            <Button
                                onClick={this.signIn}
                                color="primary"
                                disabled={!valid}
                                className="mx-2">
                                Sign In
                            </Button>
                        </Col>
                    </Row>
                </Col>
            )
        } else {
            return (
                <Fragment>
                    <Navbar />

                    <h1>Admin</h1>
                    <Button onClick={this.signOut} className="m-2">Sign Out</Button>

                    <Nav tabs>
                        <NavItem>
                            <NavLink active={this.state.activeTab === "1"} onClick={() => this.switchTab("1")}>
                                Art
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink active={this.state.activeTab === "2"} onClick={() => this.switchTab("2")}>
                                Sketchbook
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <GalleryList storage={this.storage} db={this.db} />
                        </TabPane>
                        <TabPane tabId="2">
                            <h1>Sketchbook</h1>
                        </TabPane>
                    </TabContent>
                </Fragment>
            )
        }
    }
}

export default Admin;
import {Component, Fragment} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
  FormFeedback,
  ModalFooter,
  Label,
} from 'reactstrap';
import {MdOutlineTextFields} from 'react-icons/md';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  increment,
} from 'firebase/firestore';

class UploadTextButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      text: '',
      uploading: false,
      validText: true,
      link: '',
      size: 16,
    };

    this.db = this.props.db;
  }

  openModal = () => {
    this.setState({
      modalOpen: true,
      text: '',
      validText: true,
      link: '',
      size: 16,
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  toggle = () => {
    this.setState({modalOpen: !this.state.modalOpen});
  };

  textChanged = (e) => {
    let text = e.target.value;
    let valid = text !== '';

    this.setState({
      text: text,
      validText: valid,
    });
  };

  upload = async () => {
    let text = this.state.text;

    if (!this.state.uploading) {
      if (text === '') {
        this.setState({validText: false});
      } else {
        this.setState({uploading: true});

        try {
          let collectionRef = collection(this.db, this.props.collection);
          let countRef = doc(this.db, 'counts', this.props.collection);
          let countSnap = await getDoc(countRef);
          let size = countSnap.data().count;

          text = text.replaceAll('\n', '$[n]');

          const docRef = await addDoc(collectionRef, {
            order: size,
            content: text,
            type: 'text',
            size: this.state.size,
            link: this.state.link,
          });

          await updateDoc(countRef, {
            count: increment(1),
          });

          console.log('Document written with ID: ', docRef.id);
          this.closeModal();
          this.props.onUpload();
        } catch (e) {
          console.error('Error adding document: ', e);
        }

        this.setState({uploading: false});
      }
    }
  };

  validSize = () => {
    return (
      this.state.size !== '' && !isNaN(this.state.size) && this.state.size > 0
    );
  };

  sizeChanged = (e) => {
    this.setState({size: parseInt(e.target.value)});
  };

  linkChanged = (e) => {
    this.setState({link: e.target.value});
  };

  render() {
    let validText = this.state.validText;
    let validSize = this.validSize();
    let valid = !this.state.uploading && validText && validSize;
    let link = this.state.link;

    return (
      <Fragment>
        <Button
          onClick={this.openModal}
          color='primary'
          className='fit-content ms-2'
        >
          <MdOutlineTextFields className='me-1 mb-1' />
          Upload Text
        </Button>

        <Modal isOpen={this.state.modalOpen} size='lg'>
          <ModalHeader toggle={this.toggle}>Upload Text</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input
                type='textarea'
                placeholder='Enter text'
                onChange={this.textChanged}
                invalid={!validText}
              />
              <FormFeedback>Text cannot be empty</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Font Size (px)</Label>
              <Input
                type='number'
                defaultValue={16}
                onChange={this.sizeChanged}
                invalid={!validSize}
                min={1}
              />
              <FormFeedback>
                Font size must be defined and greater than 0.
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Link</Label>
              <Input
                type='text'
                placeholder='Link'
                defaultValue={link}
                onChange={this.linkChanged}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <div className='upload-footer-row'>
              <Button onClick={this.upload} color='primary' disabled={!valid}>
                Upload
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default UploadTextButton;

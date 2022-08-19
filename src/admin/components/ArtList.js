import {Button, Col, Row} from 'reactstrap';
import UploadButton from './media/UploadButton';
import {MdRefresh} from 'react-icons/md';
import MediaDisplay from './media/MediaDisplay';
import CollectionDropdown from './CollectionDropdown';
import TextDisplay from './text/TextDisplay';
import UploadTextButton from './text/UploadTextButton';
import UploadFolderButton from './folders/UploadFolderButton';
import AWS from 'aws-sdk';
import FolderDisplay from './folders/FolderDisplay';
import {useDispatch, useSelector} from 'react-redux';
import {artSelector} from '../../shared/redux/selectors/art_selector';
import {archiveSelector} from '../../shared/redux/selectors/archive_selector';
import {fetchMedia} from '../../shared/redux/thunks/load_media';
import EditCreditsButton from './EditCreditsButton';

const S3_BUCKET = 'xavier-portfolio';
const REGION = 'us-east-2';

function ArtList(props) {
  const artMedia = useSelector(artSelector);
  const archiveMedia = useSelector(archiveSelector);
  const dispatch = useDispatch();
  const db = props.db;

  const getMedia = () => {
    const collection = props.collection;

    if (collection === 'art') {
      return artMedia;
    } else if (collection === 'other') {
      return archiveMedia;
    } else {
      console.error(`Unknown collection: ${collection}`);
      return [];
    }
  };

  const media = getMedia();

  const onUpdate = () => {
    console.log(props.collection);
    dispatch(fetchMedia({db, collectionName: props.collection}));
  };

  const collectionChanged = (collection) => {
    props.collectionChanged(collection);
  };

  const getAWSBucket = () => {
    AWS.config.update({
      accessKeyId: props.awsAccessKey,
      secretAccessKey: props.awsSecretKey,
    });

    const myBucket = new AWS.S3({
      params: {Bucket: S3_BUCKET},
      region: REGION,
    });

    return myBucket;
  };

  let displays = [];

  for (let i = 0; i < media.length; i++) {
    let current = media[i];
    let type = current.type;

    if (type === 'media') {
      displays.push(
        <MediaDisplay
          data={current}
          mediaCount={media.length}
          onUpdate={onUpdate}
          db={db}
          collection={props.collection}
          bucket={getAWSBucket()}
          key={current.docId + i.toString()}
        />
      );
    } else if (type === 'text') {
      displays.push(
        <TextDisplay
          data={current}
          mediaCount={media.length}
          onUpdate={onUpdate}
          db={db}
          collection={props.collection}
          key={current.docId + i.toString()}
        />
      );
    } else if (type === 'folder') {
      displays.push(
        <FolderDisplay
          docId={current.docId}
          db={db}
          bucket={getAWSBucket()}
          collection={props.collection}
          folderName={current.description}
          content={current.content}
          order={current.order}
          onUpdate={onUpdate}
          mediaCount={media.length}
          key={current.docId + i.toString()}
        />
      );
    }
  }

  const getFolderButton = () => {
    if (props.collection === 'other') {
      return (
        <UploadFolderButton
          db={db}
          collection={props.collection}
          bucket={getAWSBucket()}
          onUpload={onUpdate}
        />
      );
    }
  };

  return (
    <Col>
      <Col className='py-3 px-2'>
        <Row>
          <EditCreditsButton db={db} />
          <UploadButton
            db={db}
            onUpload={onUpdate}
            collection={props.collection}
            bucket={getAWSBucket()}
          />
          <UploadTextButton
            db={db}
            onUpload={onUpdate}
            collection={props.collection}
          />
          {getFolderButton()}
          <CollectionDropdown
            callback={collectionChanged}
            collections={props.collections}
            collection={props.collection}
          />
          <Button color='primary' className='fit-content' onClick={onUpdate}>
            <MdRefresh />
          </Button>
        </Row>
      </Col>
      <Row className='mx-auto'>{displays}</Row>
    </Col>
  );
}

export default ArtList;

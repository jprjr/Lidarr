import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HistoryDetailsConnector from 'Activity/History/Details/HistoryDetailsConnector';
import HistoryEventTypeCell from 'Activity/History/HistoryEventTypeCell';
import AlbumFormats from 'Album/AlbumFormats';
import TrackQuality from 'Album/TrackQuality';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import Popover from 'Components/Tooltip/Popover';
import Tooltip from 'Components/Tooltip/Tooltip';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import formatCustomFormatScore from 'Utilities/Number/formatCustomFormatScore';
import translate from 'Utilities/String/translate';
import styles from './ArtistHistoryRow.css';

function getTitle(eventType) {
  switch (eventType) {
    case 'grabbed':
      return 'Grabbed';
    case 'downloadImported':
      return 'Download Completed';
    case 'trackFileImported':
      return 'Track Imported';
    case 'downloadFailed':
      return 'Download Failed';
    case 'trackFileDeleted':
      return 'Track File Deleted';
    case 'trackFileRenamed':
      return 'Track File Renamed';
    case 'trackFileRetagged':
      return 'Track File Tags Updated';
    case 'albumImportIncomplete':
      return 'Album Import Incomplete';
    default:
      return 'Unknown';
  }
}

class ArtistHistoryRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isMarkAsFailedModalOpen: false
    };
  }

  //
  // Listeners

  onMarkAsFailedPress = () => {
    this.setState({ isMarkAsFailedModalOpen: true });
  };

  onConfirmMarkAsFailed = () => {
    this.props.onMarkAsFailedPress(this.props.id);
    this.setState({ isMarkAsFailedModalOpen: false });
  };

  onMarkAsFailedModalClose = () => {
    this.setState({ isMarkAsFailedModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      eventType,
      sourceTitle,
      quality,
      qualityCutoffNotMet,
      customFormats,
      customFormatScore,
      date,
      data,
      album
    } = this.props;

    const {
      isMarkAsFailedModalOpen
    } = this.state;

    return (
      <TableRow>
        <HistoryEventTypeCell
          eventType={eventType}
          data={data}
        />

        <TableRowCell key={name}>
          {album.title}
        </TableRowCell>

        <TableRowCell className={styles.sourceTitle}>
          {sourceTitle}
        </TableRowCell>

        <TableRowCell>
          <TrackQuality
            quality={quality}
            isCutoffNotMet={qualityCutoffNotMet}
          />
        </TableRowCell>

        <RelativeDateCellConnector
          date={date}
        />

        <TableRowCell className={styles.details}>
          <Popover
            anchor={
              <Icon
                name={icons.INFO}
              />
            }
            title={getTitle(eventType)}
            body={
              <HistoryDetailsConnector
                eventType={eventType}
                sourceTitle={sourceTitle}
                data={data}
              />
            }
            position={tooltipPositions.LEFT}
          />
        </TableRowCell>

        <TableRowCell className={styles.customFormatScore}>
          <Tooltip
            anchor={formatCustomFormatScore(
              customFormatScore,
              customFormats.length
            )}
            tooltip={<AlbumFormats formats={customFormats} />}
            position={tooltipPositions.BOTTOM}
          />
        </TableRowCell>

        <TableRowCell className={styles.actions}>
          {
            eventType === 'grabbed' &&
              <IconButton
                title={translate('MarkAsFailed')}
                name={icons.REMOVE}
                onPress={this.onMarkAsFailedPress}
              />
          }
        </TableRowCell>

        <ConfirmModal
          isOpen={isMarkAsFailedModalOpen}
          kind={kinds.DANGER}
          title={translate('MarkAsFailed')}
          message={translate('MarkAsFailedMessageText', [sourceTitle])}
          confirmLabel={translate('MarkAsFailed')}
          onConfirm={this.onConfirmMarkAsFailed}
          onCancel={this.onMarkAsFailedModalClose}
        />
      </TableRow>
    );
  }
}

ArtistHistoryRow.propTypes = {
  id: PropTypes.number.isRequired,
  eventType: PropTypes.string.isRequired,
  sourceTitle: PropTypes.string.isRequired,
  quality: PropTypes.object.isRequired,
  qualityCutoffNotMet: PropTypes.bool.isRequired,
  customFormats: PropTypes.arrayOf(PropTypes.object),
  customFormatScore: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  fullArtist: PropTypes.bool.isRequired,
  artist: PropTypes.object.isRequired,
  album: PropTypes.object.isRequired,
  onMarkAsFailedPress: PropTypes.func.isRequired
};

ArtistHistoryRow.defaultProps = {
  customFormats: []
};

export default ArtistHistoryRow;

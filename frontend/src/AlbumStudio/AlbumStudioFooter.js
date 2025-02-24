import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormInputGroup from 'Components/Form/FormInputGroup';
import MonitorAlbumsSelectInput from 'Components/Form/MonitorAlbumsSelectInput';
import MonitorNewItemsSelectInput from 'Components/Form/MonitorNewItemsSelectInput';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';
import { inputTypes, kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './AlbumStudioFooter.css';

const NO_CHANGE = 'noChange';

class AlbumStudioFooter extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      monitored: NO_CHANGE,
      monitor: NO_CHANGE,
      monitorNewItems: NO_CHANGE
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isSaving,
      saveError
    } = this.props;

    if (prevProps.isSaving && !isSaving && !saveError) {
      this.setState({
        monitored: NO_CHANGE,
        monitor: NO_CHANGE,
        monitorNewItems: NO_CHANGE
      });
    }
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  onUpdateSelectedPress = () => {
    const {
      monitor,
      monitored,
      monitorNewItems
    } = this.state;

    const changes = {};

    if (monitored !== NO_CHANGE) {
      changes.monitored = monitored === 'monitored';
    }

    if (monitor !== NO_CHANGE) {
      changes.monitor = monitor;
    }

    if (monitorNewItems !== NO_CHANGE) {
      changes.monitorNewItems = monitorNewItems;
    }

    this.props.onUpdateSelectedPress(changes);
  };

  //
  // Render

  render() {
    const {
      selectedCount,
      isSaving
    } = this.props;

    const {
      monitored,
      monitor,
      monitorNewItems
    } = this.state;

    const monitoredOptions = [
      { key: NO_CHANGE, value: translate('NoChange'), disabled: true },
      { key: 'monitored', value: translate('Monitored') },
      { key: 'unmonitored', value: translate('Unmonitored') }
    ];

    const noChanges = monitored === NO_CHANGE &&
      monitor === NO_CHANGE &&
      monitorNewItems === NO_CHANGE;

    return (
      <PageContentFooter>
        <div className={styles.inputContainer}>
          <div className={styles.label}>
            {translate('MonitorArtist')}
          </div>

          <FormInputGroup
            type={inputTypes.SELECT}
            name="monitored"
            value={monitored}
            values={monitoredOptions}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            {translate('MonitorExistingAlbums')}
          </div>

          <MonitorAlbumsSelectInput
            name="monitor"
            value={monitor}
            includeNoChange={true}
            includeNoChangeDisabled={false}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            {translate('MonitorNewAlbums')}
          </div>

          <MonitorNewItemsSelectInput
            name="monitorNewItems"
            value={monitorNewItems}
            includeNoChange={true}
            includeNoChangeDisabled={false}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div>
          <div className={styles.label}>
            {translate('CountArtistsSelected', { selectedCount })}
          </div>

          <SpinnerButton
            className={styles.updateSelectedButton}
            kind={kinds.PRIMARY}
            isSpinning={isSaving}
            isDisabled={!selectedCount || noChanges}
            onPress={this.onUpdateSelectedPress}
          >
            {translate('UpdateSelected')}
          </SpinnerButton>
        </div>
      </PageContentFooter>
    );
  }
}

AlbumStudioFooter.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  onUpdateSelectedPress: PropTypes.func.isRequired
};

export default AlbumStudioFooter;

'use babel';

import DailyNotesMessage from './daily-notes-message';
import dayjs from 'dayjs';

module.exports = {
  config: {
    DateFormat: {
      title: 'Date format',
      description: `You current syntax looks like this: ${dayjs().format(inkdrop.config.get('daily-notes.DateFormat') || 'YYYY-MM-DD')}`,
      type: 'string',
      default: 'YYYY-MM-DD',
    },
    NewFileLocationFolderName: {
      title: 'New file location folder name',
      description: 'New daily notes will be created in this folder',
      type: 'string',
      default: 'Daily Notes',
    },
    TemplateNoteId: {
      title: 'Template note id',
      description: 'Choose the note to use as a template',
      type: 'string',
      default: '',
    }
  },

  activate() {
    inkdrop.components.registerClass(DailyNotesMessage);
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'DailyNotesMessage'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'DailyNotesMessage'
    )
    inkdrop.components.deleteClass(DailyNotesMessage);
  }

};

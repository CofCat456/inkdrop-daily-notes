'use babel';

import { useEffect } from 'react'
import { logger } from 'inkdrop'
import dayjs from 'dayjs'
import { Liquid } from 'liquidjs';

export default function DailyNotesMessage() {
  const db = inkdrop.main.dataStore.getLocalDB()
  const DateFormat = inkdrop.config.get('daily-notes.DateFormat') || 'YYYY-MM-DD';
  const NewFileLocationFolderName = inkdrop.config.get('daily-notes.NewFileLocationFolderName') || 'Daily Notes';
  const TemplateNoteId = inkdrop.config.get('daily-notes.TemplateNoteId') || '';

  async function findDailyNoteBookId() {
    const book = await db.books.findWithName(NewFileLocationFolderName)

    logger.debug('Find daily note books')

    return book._id
  }

  async function findDailyNoteTemplate(title) {
    if (!TemplateNoteId) return {
      tags: [],
      body: ''
    }

    const template = await db.notes.get(TemplateNoteId)
    const { tags, body } = template

    const engine = new Liquid();
    const date = dayjs().format(DateFormat)
    const time = dayjs().format('HH:mm')

    logger.debug('Find daily note template')

    return {
      tags,
      body: await engine
      .parseAndRender(body, {
        title,
        date,
        time
      })
    }
  }

  async function createDailyNote() {
    const _id = await db.notes.createId()
    const title = dayjs().format(DateFormat)
    const bookId = await findDailyNoteBookId()
    const createdAt = +dayjs()
    const updatedAt = +dayjs()

    const { tags, body } = await findDailyNoteTemplate(title)

    const mockNote = {
      _id,
      _rev: undefined,
      title: title,
      doctype: "markdown",
      updatedAt,
      createdAt,
      tags,
      status: "none",
      share: "private",
      body,
      bookId,
      numOfTasks: 0,
      numOfCheckedTasks: 0,
      pinned: false
    }

    await db.notes.put(mockNote)

    logger.debug('Create Daily Note!')
  }

  useEffect(() => {
    const sub = inkdrop.commands.add(document.body, {
      'daily-notes:createDailyNote': createDailyNote
    })

    return () => sub.dispose()
  }, [])
}

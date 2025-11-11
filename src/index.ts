import joplin from 'api';

joplin.plugins.register({
  onStart: async function () {
    // Register settings section
    await joplin.settings.registerSection('examCountdownSection', {
      label: 'Exam Countdown',
      iconName: 'fa-hourglass-half',
    });

    // Register exam date setting
    await joplin.settings.registerSettings({
      examDate: {
        value: '2025-12-01',
        type: 2, // String
        section: 'examCountdownSection',
        public: true,
        label: 'Exam Date (YYYY-MM-DD)',
        description: 'Enter the date of your exam',
      },
    });

    // Register command
    await joplin.commands.register({
      name: 'showExamCountdown',
      label: 'Show Exam Countdown',
      execute: async () => {
        const dateStr = await joplin.settings.value('examDate');
        const examDate = new Date(dateStr);
        const today = new Date();

        const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const message = diff >= 0
          ? `${diff} day${diff === 1 ? '' : 's'} until your exam!`
          : `Your exam was ${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} ago.`;

        await joplin.views.dialogs.showMessageBox(message);
      },
    });

    // Add command to Tools menu
    await joplin.views.menus.create('examCountdownMenu', 'Exam Countdown', [
      {
        commandName: 'showExamCountdown',
        label: 'Show Exam Countdown',
      },
    ]);
  },
});
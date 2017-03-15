const steno = require('../dist/steno').default;

steno.initSteno('steno tester', 'all');

steno.error('📛 Error')
    .warn('⚠️ Warning')
    .info('ℹ️ Info')
    .log('🙆🏼‍♂️ Log')
    .perf('⏱ perf 0')
    .perf('⏱ perf 1')
    .flush();

steno.setLogLevel('-error,+info,+log,-warn,-perf');
steno.error('📛 Error', '💩 You should not see it!')
    .warn('⚠️ Warning', '💩 You should not see it!')
    .info('ℹ️ Info')
    .log('🙆🏼‍♂️ Log')
    .perf('⏱ perf 0', '💩 You should not see it!')
    .perf('⏱ perf 1', '💩 You should not see it!')
    .flush();


steno.initSteno('steno perf tester', '+error,-warn,-info,-log,+perf');
steno.error('📛 Error -- 0')
    .warn('⚠️ Warning', '💩 You should not see it!')
    .info('ℹ️ Info', '💩 You should not see it!')
    .log('🙆🏼‍♂️ Log', '💩 You should not see it!')
    .perf('⏱ perf -- 2')
    .perf('⏱ perf -- 3')
    .error('📛 Error -- 1')
    .flush();

steno.setLogLevel('none');
steno.error('📛 Error', '💩 You should not see it!')
    .warn('⚠️ Warning', '💩 You should not see it!')
    .info('ℹ️ Info', '💩 You should not see it!')
    .log('🙆🏼‍♂️ Log', '💩 You should not see it!')
    .perf('⏱ perf 0', '💩 You should not see it!')
    .perf('⏱ perf 1', '💩 You should not see it!')
    .flush();

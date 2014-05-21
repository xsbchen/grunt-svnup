/*
 * grunt-svnup
 * http://pay.qq.com/
 *
 * Copyright (c) 2013 Bingo(xsbchen@tencent.com)
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path');

module.exports = function (grunt) {
    grunt.registerMultiTask('svnup', 'svn更新任务', function () {
        var done = this.async();
        var paths = this.data;

        if (typeof paths === 'string') {
            paths = [paths];
        }

        var doneCount = paths.length;

        if (doneCount) {
            paths.forEach(function (wc) {
                grunt.log.write('Update Working copy on ' + wc.cyan + '...');

                grunt.util.spawn({
                    cmd: 'svn',
                    args: ['update', '--non-interactive', path.resolve(wc)]
                }, function (err) {
                    if (err) {
                        grunt.log.error();

                        if (err.toString().indexOf('not found: svn') >= 0) {
                            grunt.log.error('当你看到这个提示，说明你安装TSVN时没有选择安装SVN命令行。');
                            grunt.log.error('请重装TortoiseSVN最新版本请选择附带的svn命令行；');
                            grunt.log.error('或者手工安装svn命令行。如有疑问RTX:xsbchen');
                        } else if (err.toString().indexOf('Authentication failed') >= 0) {
                            grunt.log.error('身份认证失败，请尝试运行svn up并保存认证信息。');
                        }

                        grunt.warn(err);
                    }

                    grunt.log.ok();
                    doneCount--;

                    if (doneCount === 0) {
                        done(true);
                    }
                });
            });
        } else {
            grunt.log.writeln('No WorkCopy need to update!');
        }
    });
};
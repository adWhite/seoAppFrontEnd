var LIVERELOAD_PORT = 35729;

var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                livereload: true
            },
            browserify: {
                files: './js/**/*.js',   
                tasks: ['browserify']
            },
            // uglify: {
            //     files: './build/bundle.js',
            //     tasks: ['uglify']
            // },
            less: {
                files: './less/*.less',
                tasks: ['less', 'autoprefixer']
            },
            livereload: {
                livereload: true,
                files: [
                    './*.html',
                    './build/bundle.min.js',
                    './css/*.css'
                ]
            }
        },

        // uglify: {
        //     target: {
        //         options: {
        //             compress: true,
        //             wrap: "jolv"
        //         },
        //         files: {
        //             './build/bundle.min.js': ['./build/bundle.js']  
        //         }
        //     }
        // },

        browserify: {
            options: {
                transform: ['reactify'],
                extensions: ['.jsx']
            },
            dev: {
                files: {
                    './build/bundle.js': ['./js/**/*.js']
                }
            }
        },

        less: {
            options: {
                syncImport: true,
                compress: true,
                ieCompat: true
            },
            dev: {
                files: {
                    './css/style.css': './less/style.less'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers:['last 2 versions', 'ie 8', 'ie 7']
            },
            target: {
                src: './css/style.css',
                dest: './css/style.css'
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function ( connect ) {
                        return [
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, '')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },

        imagemin: {
            target: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: './img',
                    src: '*.{png,jpg,jpeg}',
                    dest: '../production/img'
                }]
            }
        },

        rsync: {
            options: {
                args: ["--verbose"],
                exclude: ["less", "*~", "*.swp", ".*", "node_modules", "production", "Gruntfile.js", "package.json"],
                recursive: true
            },
            dist: {
                options: {
                    src: "./",
                    dest: "./production/"
                }
            }
        }
    });

    // load plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // default task(s)
    grunt.registerTask('default', function() {
        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });
    
    grunt.registerTask('build', function() {
        grunt.task.run([
            'rsync',
            'imagemin:target'
        ]);
    });
};

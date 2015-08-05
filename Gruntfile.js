module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: false,
				newcap: false,
				noarg: true,
				sub: true,
				undef: false,
				boss: true,
				eqnull: true,
				unused: false,
				browser: true,
				strict: false,
				jquery: true,
				smarttabs: true
			},
			globals: {
				angular: true,
				moment: true,
				console: true,
				define: true,
				require: true
			},
			all: [
			'js/src/*.js'
			]
		},
		copy: {
			normalize: {
				files: [{
					expand: true,
					dest: 'scss/',
					flatten: true,
					filter: 'isFile',
					src: 'bower_components/normalize.css/normalize.css',
					rename: function(dest, src) {
						return dest + "_" + src.replace('.css','.scss');
					}
				}]
			}
		},

		concat: {
			options: {
				separator: '\n\n'
			},
			dist: {
				src: [
				'bower_components/jquery/dist/jquery.js',
				'bower_components/raf.js/raf.js',
				'bower_components/imagesloaded/imagesloaded.pkgd.js',
				'js/*.js'
				],
				dest: 'build/js/app.js'
			}
		},

		asciify: {
			appBanner: {
				text: '<%= pkg.name %>',
				options: {
					font: 'isometric1', // http://www.figlet.org/examples.html
					log: false
				}
			}
		},

		bumpup: {
			files: ['package.json', 'bower.json']
		},

		uglify: {
			options: {
				banner: '/*! \n <%= asciify_appBanner %> \n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n',
				preserveComments: 'some',
				mangle: false
			},
			build: {
				src: 'build/js/app.js',
				dest: 'build/js/app.min.js'
			}
		},

		watch: {
			css: {
				files: [
				'build/css/*.css'
				],
				options: {
					livereload: true
				}
			},
			js: {
				files: [
				'js/*.js'
				],
				options: {
					livereload: true
				},
				tasks: ['concat:dist', 'asciify', 'uglify']
			},
			html: {
				files: [
				'templates/*.hbs',
				'templates/**/*.hbs'
				],
				tasks: ['assemble'],
				options: {
					livereload: true
				}
			},
			scss: {
				files: [
				'scss/*.scss'
				],
				tasks: ['sass']
			}
		},

		s3:{
			options: {
				accessKeyId: "",
				secretAccessKey: "/",
				bucket: "", //http://*.s3-website-eu-west-1.amazonaws.com/
				region: "eu-west-1",
				enableWeb: true,
				dryRun: false,
				headers: {
					CacheControl: 3600
				}
			},
			build: {
				cwd: "build/",
				src: "**"
			}
		},
		shell: {
			cloudflare: {
				command: "curl https://www.cloudflare.com/api_json.html  -d 'a=fpurge_ts' -d 'tkn=4490bcd83ce01d13388ccdbe81425266024f7' -d 'email=email@domain.com' -d 'z=domain.com' -d 'v=1'"
			}
		},
		sass: {
			dist: {
				options: {
					outputStyle: 'expanded',
					includePaths: require('node-neat').includePaths,
				},
				files: [{
					expand: true,
					cwd: 'scss',
					src: ['*.scss'],
					dest: 'build/css',
					ext: '.css'
				}]
			}
		},

		browserSync: {
			default_options: {
				bsFiles: {
					src: [
					"build/css/*.css",
					'build/*.html',
					'build/js/*.js'
					]
				},
				options: {
					watchTask: true,
					open: "external",
					server: {
						baseDir: "build"
					}
				}
			}
		},

		connect: {
			server: {
				options: {
					port: 3001,
					base: 'build'
				}
			}
		},

		assemble: {
			options: {
				flatten: true,
				layout: 'default.hbs',
				layoutdir: 'templates/layouts', 
				pkg: '<%= pkg %>',
				helpers: ['handlebars-helper-repeat'],
				partials: ['templates/partials/*.hbs' ]
			},
			pages: {
				src: 'templates/*.hbs',
				dest: 'build/'
			}
		},
		favicons: {
			options: {
				trueColor: true,
				precomposed: true,
				appleTouchBackgroundColor: "#fff",
				windowsTile: true,
				tileBlackWhite: false,
				tileColor: "#fff",
				androidHomescreen: true,
				html: 'templates/partials/icons.hbs',
				HTMLPrefix: 'icons/'
			},
			icons: {
				src: 'logo.png',
				dest: 'build/icons'
			}
		}
	});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-browser-sync');
grunt.loadNpmTasks('grunt-asciify');
grunt.loadNpmTasks('grunt-bumpup');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-aws');
grunt.loadNpmTasks('grunt-favicons');
grunt.loadNpmTasks('assemble');

grunt.registerTask('syncwatch', ['browserSync', 'watch']);
grunt.registerTask('deploy', ['s3:build']); // Add shell:cloudflare to purge cloudflare cache
grunt.registerTask('default', ['assemble', 'copy', 'jshint', 'concat:dist', 'asciify', 'bumpup', 'uglify', 'sass']);

};
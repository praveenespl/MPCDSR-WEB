import { LayoutConfigModel } from '../_base/layout';

export class LayoutConfig {
	public defaults: LayoutConfigModel = {
		demo: 'demo5',
		self: {
			layout: 'fluid',
			body: {
				'background-image': './assets/media/misc/bg-1.jpg'
			},
			logo: {
				desktop: './assets/media/app/images/logos/national-health-mission.png',
				sticky: './assets/media/app/images/logos/national-health-mission-sm.png'
			},
			suman: {
				desktop: './assets/media/app/images/logos/suman-lg.png',
				sticky: './assets/media/app/images/logos/suman-sm.png'
			}
		},
		loader: {
			enabled: true,
			type: 'spinner-logo',
			logo: './assets/media/app/images/logos/national-health-mission-lg.png',
			message: 'Please wait...'
		},
		colors: {
			state: {
				brand: '#3d94fb',
				light: '#ffffff',
				dark: '#282a3c',
				primary: '#337ab7', // '#065290', // '#5867dd',
				success: '#34bfa3',
				info: '#3d94fb',
				warning: '#ffb822',
				danger: '#dc3545'// '#fd27eb'
			},
			base: {
				label: ['#c5cbe3', '#a1a8c3', '#3d4465', '#3e4466'],
				shape: ['#f0f3ff', '#d9dffa', '#afb4d4', '#646c9a']
			}
		},
		header: {
			self: {
				width: 'fixed',
				fixed: {
					desktop: {
						enabled: true,
						mode: 'all'
					},
					mobile: true
				}
			},
			menu: {
				self: {
					display: true,
					'root-arrow': false
				},
				desktop: {
					arrow: true,
					toggle: 'click',
					submenu: {
						skin: 'light',
						arrow: true
					}
				},
				mobile: {
					submenu: {
						skin: 'dark',
						accordion: true
					}
				}
			}
		},
		subheader: {
			display: false,
			fixed: false,
			layout: 'subheader-v1',
			width: 'fixed',
			style: 'transparent'
		},
		aside: {
			self: {
				fixed: true,
				display: false,
				minimize: {
					toggle: true,
					default: false
				}
			},
			menu: {
				dropdown: false,
				scroll: true,
				submenu: {
					accordion: true,
					dropdown: {
						arrow: true,
						'hover-timeout': 500
					}
				}
			}
		},
		content: {
			width: 'fixed'
		},
		footer: {
			self: {
				width: 'fixed',
				layout: 'extended'
			}
		}
	};

	/**
	 * Good place for getting the remote config
	 */
	public get configs(): LayoutConfigModel {
		return this.defaults;
	}
}

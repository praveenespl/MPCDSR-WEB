export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: "Dashboard",
					root: true,
					alignment: "left",
					page: "/mdsr/dashboard"
				},
				{
					title: "Reports",
					root: true,
					alignment: "left",
					toggle: "click",
					submenu: [
						{
							title: "Notified vs Reviewed",
							page: "/reports/notifiedvsreviewed"
						}
					]
				},
				{
					title: "Data Entry",
					root: true,
					alignment: "left",
					toggle: "click",
					submenu: [
						// {
						// 	title: "MDSR",
						// 	root: false,
						// 	alignment: "right",
						// 	toggle: "click",
						// 	submenu: [
								{
									bullet: "dot",
									title: "Form 1: Notification Card",
									page: "/mdsr/form1"
								},
								{
									bullet: "dot",
									title: "Form 2: MDR Register",
									page: "/mdsr/form2"
								},

								{
									bullet: "dot",
									title: "Form 3: MDR Line Listing",
									page: "/mdsr/form3"
								},
								{
									bullet: "dot",
									title: "Form 4: Maternal Death Review",
									page: "/mdsr/form4"
								},
								{
									bullet: "dot",
									title: "Form 5: Maternal Deaths Investigation",
									page: "/mdsr/form5"
								},
								{
									bullet: "dot",
									title: "Form 6: MDR Case Summary",
									page: "/mdsr/form6"
								}
						// 	]
						// },
					]
				},
				// {
				// 	title: "CDR Data Entry",
				// 	root: true,
				// 	alignment: "left",
				// 	toggle: "click",
				// 	submenu: [
				// 		{
				// 			bullet: "dot",
				// 			title: "Dashboard",
				// 			page: "/cdr/dashboard"
				// 		},
				// 		{
				// 			bullet: "dot",
				// 			title: "Form 1",
				// 			page: "/cdr/form1"
				// 		},
				// 		{
				// 			bullet: "dot",
				// 			title: "Form 2",
				// 			page: "/cdr/form2"
				// 		},

				// 		{
				// 			bullet: "dot",
				// 			title: "Form 3",
				// 			submenu: [
				// 				{ title: "Form 3A", page: "/cdr/form3/a" },
				// 				{ title: "Form 3B", page: "/cdr/form3/b" },
				// 				{ title: "Form 3C", page: "/cdr/form3/c" }
				// 			]
				// 		},
				// 		{
				// 			bullet: "dot",
				// 			title: "Form 4",
				// 			submenu: [
				// 				{ title: "Form 4A", page: "/cdr/form4a" },
				// 				{ title: "Form 4B", page: "/cdr/form4b" }
				// 			]
				// 		},
				// 		{
				// 			bullet: "dot",
				// 			title: "Form 5",
				// 			submenu: [
				// 				{ title: "Form 5A", page: "/cdr/form5a" },
				// 				{ title: "Form 5B", page: "/cdr/form5b" },
				// 				{ title: "Form 5C", page: "/cdr/form5c" },
				// 				{ title: "Form 5D", page: "/cdr/form5d" }
				// 			]
				// 		}
				// 	]
				// },
				{
					title: "Configration",
					root: true,
					alignment: "left",
					toggle: "click",
					submenu: [
						{
							title: "Role",
							page: "/roles"
						}
					]
				}
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: "Dashboard",
					root: true,
					alignment: "left",
					page: "/mdsr/dashboard"
				},
				{
					title: "Reports",
					root: true,
					alignment: "left",
					toggle: "click",
					submenu: [
						{
							title: "Notified vs Reviewed",
							page: "/reports/notifiedvsreviewed"
						}
					]
				},
				{
					title: "Data Entry",
					root: true,
					alignment: "left",
					toggle: "click",
					submenu: [
						{
							title: "MDSR",
							root: false,
							alignment: "right",
							toggle: "click",
							submenu: [
								{
									bullet: "dot",
									title: "Form 1: Notification Card",
									page: "/mdsr/form1"
								},
								{
									bullet: "dot",
									title: "Form 2: MDR Register",
									page: "/mdsr/form2"
								},

								{
									bullet: "dot",
									title: "Form 3: MDR Line Listing",
									page: "/mdsr/form3"
								},
								{
									bullet: "dot",
									title: "Form 4: Maternal Death Review",
									page: "/mdsr/form4"
								},
								{
									bullet: "dot",
									title: "Form 5: Maternal Deaths Investigation",
									page: "/mdsr/form5"
								},
								{
									bullet: "dot",
									title: "Form 6: MDR Case Summary",
									page: "/mdsr/form6"
								}
							]
						},
						{
							title: "CDR",
							root: false,
							alignment: "right",
							toggle: "click",
							submenu: [
								{
									bullet: "dot",
									title: "Dashboard",
									page: "/cdr/dashboard"
								},
								{
									bullet: "dot",
									title: "Form 1",
									page: "/cdr/form1"
								},
								{
									bullet: "dot",
									title: "Form 2",
									page: "/cdr/form2"
								},

								{
									bullet: "dot",
									title: "Form 3",
									submenu: [
										{ title: "Form 3A", page: "/cdr/form3a" },
										{ title: "Form 3B", page: "/cdr/form3b" },
										{ title: "Form 3C", page: "/cdr/form3c" }
									]
								},
								{
									bullet: "dot",
									title: "Form 4",
									submenu: [
										{ title: "Form 4A", page: "/cdr/form4a" },
										{ title: "Form 4B", page: "/cdr/form4b" }
									]
								},
								{
									bullet: "dot",
									title: "Form 5",
									submenu: [
										{ title: "Form 5A", page: "/cdr/form5a" },
										{ title: "Form 5B", page: "/cdr/form5b" },
										{ title: "Form 5C", page: "/cdr/form5c" },
										{ title: "Form 5D", page: "/cdr/form5d" }
									]
								}
							]
						}
					]
				}
			]
		}
	};

	public get configs(): any {
		return this.defaults;
	}
}

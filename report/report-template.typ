// #let song = "Source Han Serif SC"
#let song = ("Times New Roman", "SimSun")
// #let hei = "SimHei"
#let hei = "Source Han Sans SC"
#let san = 16pt
#let xiaosan = 15pt
#let si = 14pt
#let xiaosi = 12pt

#let fake-par = {
  v(-1em)
  show par: set block(spacing: 0pt)
  par("")
}

#let cover(
  course: "",
  name: "",
  college: "",
  department: "",
  major: "",
  id: "",
  advisor: "",
  date: "",
) = {

  let info-key(body) = {
    rect(
      width: 100%,
      height: 23pt,
      inset: (x: 0pt, bottom: 1pt),
      stroke: none,
      align(right)[
        #text(
          font: song,
          size: si,
          body,
      )],
    )
  }

  let info-value(body) = {
    rect(
      width: 100%,
      height: 23pt,
      inset: (x: 0pt, bottom: 1pt),
      stroke: (bottom: 0.5pt),
      text(
        font: song,
        size: si,
        body,
      ),
    )
  }

  set align(center)
  set text(font: song, size: si, lang: "zh")

  pagebreak(weak: true)

  v(60pt)
  image("assets/logo.svg", width: 50%)
  v(20pt)
  text(font: "Source Han Serif SC", size: san, weight: "bold")[本科实验报告]
  v(50pt)
  table(
    columns: (75pt, 300pt),
    row-gutter: 13pt,
    stroke: none,
    info-key("课程名称："), info-value(course),
    info-key("姓       名："), info-value(name),
    info-key("学       院："), info-value(college),
    info-key("系："), info-value(department),
    info-key("专       业："), info-value(major),
    info-key("学       号："), info-value(id),
    info-key("指导教师："), info-value(advisor),
  )
  v(50pt)
  date

  pagebreak(weak: true)

}

#let report-title(
  course: "",
  type: "",
  title: "",
  name: "",
  major: "",
  id: "",
  collab: "",
  advisor: "",
  location: "",
  date-year: "",
  date-month: "",
  date-day: "",
  before-title: "",
) = {
  
  let info-key(body) = {
    rect(
      width: 100%,
      height: 23pt,
      inset: (left: 3pt, bottom: 2pt),
      stroke: none,
      align(left)[
        #text(
          font: song,
          size: xiaosi,
          body,
      )],
    )
  }

  let info-value(body) = {
    rect(
      width: 100%,
      inset: (bottom: 2pt),
      stroke: (bottom: 0.5pt),
      text(
        font: song,
        size: xiaosi,
        body,
      ),
    )
  }

  set align(center)
  set text(font: song, size: xiaosi, lang: "zh")
  text(font: "Source Han Serif SC", size: xiaosan, weight: "bold")[浙江大学实验报告]
  v(15pt)
  table(
    columns: (1fr, 51%, 1fr, 21%),
    inset: 0pt,
    stroke: none,
    info-key("课程名称："), info-value(course),
    info-key("实验类型："), info-value(type),
  )
  v(-1em)
  table(
    columns: (1fr, 81%),
    inset: 0pt,
    stroke: none,
    info-key("实验项目名称："), info-value(title),
  )
  v(-1em)
  table(
    columns: (5fr, 15%, 3fr, 33%, 3fr, 21%),
    inset: 0pt,
    stroke: none,
    info-key("学生姓名："), info-value(name),
    info-key("专业："), info-value(major),
    info-key("学号："), info-value(id),
  )
  v(-1em)
  table(
    columns: (7fr, 47%, 5fr, 20%),
    inset: 0pt,
    stroke: none,
    info-key("同组学生姓名："), info-value(collab),
    info-key("指导教师："), info-value(advisor),
  )
  v(-1em)
  table(
    columns: (4fr, 43%, 4fr, 9%, 1fr, 5%, 1fr, 5%, 1fr),
    inset: 0pt,
    stroke: none,
    info-key("实验地点："), info-value(location),
    info-key("实验日期："),
    info-value(date-year), info-key("年"),
    info-value(date-month), info-key("月"),
    info-value(date-day), info-key("日"),
  )
  
}

#let project(
  verbose: true,
  show-outline: true,
  title: " ",
  course: " ",
  author: " ",
  id: " ",
  collaborator: " ",
  advisor: " ",
  college: " ",
  department: " ",
  major: " ",
  location: " ",
  type: " ",
  year: 2023,
  month: 12,
  day: 3,
  before-title: "",
  body
) = {
  // Set the document's basic properties.
  // set document(author: authors.map(a => a.name), title: title)
  
  if verbose {
    cover(
      course: course,
      name: author,
      college: college,
      department: department,
      major: major,
      id: id,
      advisor: advisor,
      date: [#year] + "  年  " + [#month] + "  月  " + [#day] + "  日  ",
    )

    report-title(
      course: course,
      type: type,
      title: title,
      name: author,
      major: major,
      id: id,
      collab: collaborator,
      advisor: advisor,
      location: location,
      date-year: [#year],
      date-month: [#month],
      date-day: [#day],
      before-title: before-title,
    )
  } else {
    v(9.6fr)
    let before-titles = before-title.split("\n")
    pad(
      top: 0.7em,
      right: 20%,
      grid(
        columns: (1fr,) * calc.min(3, before-titles.len()),
        gutter: 1em,
        ..before-titles.map(author => align(start, text(font: hei, size: 24pt, weight: "bold", strong(author)))),
      ),
    )
    text(font: hei, size: 36pt, weight: "bold", lang: "zh", title)
    v(2.4fr)
  }

  let body-start-loc = state("body-start-loc", 0)
  locate(loc => {
    body-start-loc.update(loc)
  })
  let outline-start-loc = state("outline-start-loc", 0)
  locate(loc => {
    outline-start-loc.update(loc)
  })

  set text(font: song, size: xiaosi, lang: "zh")

  set page(numbering: (..numbers) => locate(loc => {
    let body-start = counter(page).at(body-start-loc.final(loc)).at(0)
    let outline-start = counter(page).at(outline-start-loc.final(loc)).at(0)
    if numbers.pos().at(0) >= body-start {
      numbering("1", numbers.pos().at(0) - body-start + 1)
    } else if numbers.pos().at(0) >= outline-start {
      numbering("I", numbers.pos().at(0) - outline-start + 1)
    }
  }))

  // outline page
  if show-outline {
    pagebreak(weak: true)

    locate(loc => {
      outline-start-loc.update(loc)
    })

    v(20pt)
    align(center)[
      #text(font: hei, size: san, weight: "bold")[#{"目    录"}]
    ]

    outline(
      title: none
    )

    pagebreak(weak: true)
  }

  set par(
    leading: 0.8em,
    first-line-indent: 2em,
    justify: true,
  )
  set heading(numbering: "1.1 ")
  set list(indent: 2em, body-indent: 0.5em)
  set enum(indent: 2em, body-indent: 0.5em)

  show heading: it => {
    text(font: hei)[#it]
    v(0.5em)
    fake-par
  }
  
  show terms: it => {
    set par(first-line-indent: 0pt)
    set terms(indent: 10pt, hanging-indent: 9pt)
    it
    fake-par
  }
  
  show raw: text.with(font: ("Lucida Sans Typewriter", "Source Han Sans HW SC"))

  show raw.where(block: true): it => {
    it
    fake-par
  }

  show enum: it => {
    it
    fake-par
  }

  show list: it => {
    it
    fake-par
  }

  show figure: it => {
    it
    fake-par
  }

  show table: it => {
    it
    fake-par
  }

  locate(loc => {
    body-start-loc.update(loc)
  })
  
  body
}
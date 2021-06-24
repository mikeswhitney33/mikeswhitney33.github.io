function format_phone(phone){
    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
}

function format_list(list) {
    const content = list.map(function(item) {return `<li>${item}</li>`;}).join("");
    return `<ul>${content}</ul>`;
}

function format_degree(degree) {
    const expected = degree.expected ? "expected" : "";
    const end = `<div class="row">
    <div class="col-12">${degree.end}</div>
    <div class="col-12"><i>${expected}</i></div>
</div>`;
    const info = `<div class="row">
    <div class="col-12"><strong>${degree.school}</strong>, ${degree.college} - ${degree.location} | ${degree.end}</div>
    <div class="col-12"><i>${degree.degree}</i></div>
    <div class="col-12">${format_list(degree.points)}</div>
</div>`

    return `<div class="row">
    <div class="col-12">${info}</div>
</div>`;
}


function format_education(education) {
    return education.map(format_degree).join("");
}


function format_job(job) {
    return `<div class="row">
    <div class="col-12">
        <div class="row">
            <div class="col-12">
                <strong>${job.company}</strong> - ${job.location} | ${job.dates}
            </div>
            <div class="col-12">
                <i>${job.position}</i>
            </div>
            <div class="col-12">
                ${format_list(job.achievements)}
            </div>
        </div>
    </div>
</div>`
}

function format_work(work) {
    return work.map(format_job).join("");
}


function main() {
    $("#name").html(resume.name);
    $("#email").html(resume.email);
    $("#phone").html(format_phone(resume.phone));
    $("#statement").html(resume.statement);
    $("#overview").append(format_list(resume.overview));
    $("#education").append(format_education(resume.education));
    $("#skills").append(format_list(resume.skills));
    $("#work").append(format_work(resume.work));
    $("#hobbies").append(format_list(resume.hobbies));
}

$(document).ready(main);
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>


<!DOCTYPE html>
<html>

<body>

<div>
	<div>
		<div>
			<h2>调用列表</h2>
		</div>
		<div>
			<table>
				<thead>
				<tr>
					<th>id</th>
					<th>callerid</th>
					<th>calleeid</th>
				</tr>
				</thead>

				<tbody>
				<c:forEach var="call" items="${calls}">
					<tr>
						<td>${call.id}</td>
						<td>${call.callerId}</td>
						<td>
							${call.caleeId}
						</td>

					</tr>
				</c:forEach>

				</tbody>
			</table>
		</div>
	</div>
</div>

</body>
</html>
